namespace $ {
	
	export class $hyoo_harp_arg extends $mol_object {
		
		@ $mol_mem
		static uri( next = '' ) {
			return next
		}
		
		static link( over: Record< string, string | null > ) {
			return $hyoo_harp_to_string(
				this.state_full(
					Object.fromEntries(
						Object.entries( over ).map( ([ key, val ])=> [
							key,
							val === null ? null! : { '=': [[ val ]] },
						] )
					)
				)
			)
		}
		
		@ $mol_action
		static go( next: Record< string, string | null > ) {
			this.uri( this.link( next ) )
		}
		
		static state_full( over: $hyoo_harp_query = {} ) {
			return {
				... this.state(),
				... over,
			}
		}
		
		@ $mol_mem
		static state( next?: $hyoo_harp_query ) {
			if( !next ) return $hyoo_harp_from_string( this.uri() )
			this.uri( $hyoo_harp_to_string( next ) )
			return next
		}
		
		@ $mol_mem_key
		static value( key: string, next?: string | null ) {
			if( next === undefined ) return this.state()[ key ]?.['=']?.[0]?.[0] ?? null
			const data = { ... this.state() }
			if( next === null ) delete data[ key ]
			else data[ key ] = { '=': [[next]] }
			this.state( data )
			return next
		}
		
		@ $mol_mem_key
		static dive( key: string ) {
			const self = this
			return class $hyoo_harp_arg extends this {
				
				static uri = ( next: string )=> self.uri( next )
				static state = ( next?: $hyoo_harp_query )=> self.state( next && { ... self.state(), [key]: next } )[ key ] ?? {}
				static state_full = ( next: $hyoo_harp_query )=> self.state_full({ ... self.state(), [key]: { ... self.state()[key] , ... next } })
				
			}
		}
		
	}
	
}
