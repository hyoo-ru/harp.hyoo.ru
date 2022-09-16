namespace $.$$ {
	
	export class $hyoo_harp_app extends $.$hyoo_harp_app {
		
		@ $mol_mem
		uri( next?: string ) {
			return this.$.$mol_state_arg.value( 'query', next ) ?? super.uri()
		}
		
		@ $mol_mem
		json() {
			return $hyoo_harp_from_string( this.uri() )
		}
		
		@ $mol_mem
		rate() {
			return $hyoo_harp_rate( this.json() )
		}
		
	}
	
}
