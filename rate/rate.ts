namespace $ {
	
	function count(	query: $hyoo_harp_query< any > ) {
		return 
	}
	
	export function $hyoo_harp_rate(
		query: $hyoo_harp_query< any >,
	) {
			
		let rate = 1
		
		for( const field of Object.keys( query ) as ( keyof typeof query )[] ) {
			switch( field ) {
				case '=': break
				case '+': break
				case '!=': break
				case '_num': break
				default:
					const kid = query[ field ]
					const mult = $hyoo_harp_rate( kid )
					if( mult === 1 )  rate += ( kid['=']?.length ?? kid['!=']?.length ?? 1/10 ) * 10
					else rate += mult
			}
		}
		
		return rate
		
	}
	
}
