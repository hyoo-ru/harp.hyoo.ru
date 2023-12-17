namespace $.$$ {
	
	export class $hyoo_harp_arg extends $.$hyoo_harp_arg {
		
		@ $mol_mem
		static uri( next?: string ) {
			
			const context = this.$.$mol_dom_context
			const location = context.location
			
			if( next === undefined ) {
				
				return ( location.hash || location.search ).replace( /^\?|^#!?/, '' )
				
			} else {
				
				new $mol_after_frame( ()=> {
					
					const next = '#!' + this.uri()
					if( next === location.hash ) return
					
					const history = context.history
					history.replaceState( history.state, context.document.title, next )
					
					if( context.parent !== context.self ) {
						context.parent.postMessage( [ 'hashchange', location.href ], '*' )
					}
					
				} )
				
				return next
			}
		}
		
		static link( over: Record< string, string | null > ) {
			return '#!' + super.link( over )
		}
		
		@ $mol_action
		static go( next: Record< string, string | null > ) {
			this.$.$mol_dom_context.location.href = this.link( next )
		}
		
	}
	
	self.addEventListener( 'hashchange' , event => $hyoo_harp_arg.uri( new URL( event.newURL ).hash.replace( /^\?|^#!?/, '' ) ) )
	
}
