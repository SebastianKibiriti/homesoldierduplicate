import { createClient } from '@supabase/supabase-js';
import { captureSupabaseError, measureSupabaseOperation, addSentryBreadcrumb } from './sentry';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Enhanced Supabase client with Sentry integration
class SupabaseClientWithSentry {
  private client = supabase;

  // Wrapper for database operations with error monitoring
  async query<T>(
    operation: string,
    queryFn: () => Promise<{ data: T | null; error: any }>,
    context?: Record<string, any>
  ): Promise<{ data: T | null; error: any }> {
    addSentryBreadcrumb(
      `Starting Supabase operation: ${operation}`,
      'supabase',
      'info',
      context
    );

    return measureSupabaseOperation(
      operation,
      async () => {
        const result = await queryFn();
        
        if (result.error) {
          captureSupabaseError(result.error, {
            operation,
            ...context,
          });
          
          addSentryBreadcrumb(
            `Supabase operation failed: ${operation}`,
            'supabase',
            'error',
            { error: result.error, ...context }
          );
        } else {
          addSentryBreadcrumb(
            `Supabase operation succeeded: ${operation}`,
            'supabase',
            'info',
            context
          );
        }
        
        return result;
      },
      context
    );
  }

  // Enhanced auth methods
  auth = {
    ...this.client.auth,
    
    signInWithPassword: async (credentials: { email: string; password: string }) => {
      return this.query(
        'auth.signInWithPassword',
        () => this.client.auth.signInWithPassword(credentials),
        { email: credentials.email }
      );
    },
    
    signUp: async (credentials: { email: string; password: string; options?: any }) => {
      return this.query(
        'auth.signUp',
        () => this.client.auth.signUp(credentials),
        { email: credentials.email }
      );
    },
    
    signOut: async () => {
      return this.query(
        'auth.signOut',
        () => this.client.auth.signOut()
      );
    },
  };

  // Enhanced database methods
  from(table: string) {
    const originalFrom = this.client.from(table);
    
    return {
      ...originalFrom,
      
      select: (query?: string) => {
        const selectQuery = originalFrom.select(query);
        const originalMethod = selectQuery.then;
        
        selectQuery.then = (onfulfilled, onrejected) => {
          return this.query(
            `${table}.select`,
            () => originalMethod.call(selectQuery, onfulfilled, onrejected),
            { table, query }
          );
        };
        
        return selectQuery;
      },
      
      insert: (values: any) => {
        const insertQuery = originalFrom.insert(values);
        const originalMethod = insertQuery.then;
        
        insertQuery.then = (onfulfilled, onrejected) => {
          return this.query(
            `${table}.insert`,
            () => originalMethod.call(insertQuery, onfulfilled, onrejected),
            { table, recordCount: Array.isArray(values) ? values.length : 1 }
          );
        };
        
        return insertQuery;
      },
      
      update: (values: any) => {
        const updateQuery = originalFrom.update(values);
        const originalMethod = updateQuery.then;
        
        updateQuery.then = (onfulfilled, onrejected) => {
          return this.query(
            `${table}.update`,
            () => originalMethod.call(updateQuery, onfulfilled, onrejected),
            { table }
          );
        };
        
        return updateQuery;
      },
      
      delete: () => {
        const deleteQuery = originalFrom.delete();
        const originalMethod = deleteQuery.then;
        
        deleteQuery.then = (onfulfilled, onrejected) => {
          return this.query(
            `${table}.delete`,
            () => originalMethod.call(deleteQuery, onfulfilled, onrejected),
            { table }
          );
        };
        
        return deleteQuery;
      },
    };
  }
}

// Export the enhanced client
export const supabaseWithSentry = new SupabaseClientWithSentry();

// Keep the original export for backward compatibility
export default supabase;