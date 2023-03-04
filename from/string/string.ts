namespace $ {
	
	const syntax = new $mol_syntax2({
		'filter' : /!?=/ ,
		'list_separator' : /,/ ,
		'range_separator' : /@/ ,
		'fetch_open' : /\(/ ,
		'fetch_separator' : /[;&\/?#]/ ,
		'fetch_close' : /\)/ ,
	})

	export function $hyoo_harp_from_string( uri: string ): $hyoo_harp_query {
		
		let parent = {} as $hyoo_harp_query
		let prev = null as null | $hyoo_harp_query
		let stack = [ parent ]
		let range = null as null | string[]
		let values = null as null | string[][]

		function fail_at( offset : number ) {
			const uri_marked = uri.substring( 0 , offset ) + '\u035C' + uri.substring( offset )
			$mol_fail( new Error( `Unexpected token at ${ offset } of "${ uri_marked }"` ) )
		}
		
		syntax.parse( uri , {

			'' : ( text , chunks , offset ) => {

				if( values ) {

					text = decodeURIComponent( text )
					range = ( range && range.length > 1 )
						? [ range[0] , range[1] + text ]
						: [ ( range?.[0] ?? '' ) + text ]
					
				} else {

					let [, order, name ] = /^([+-]?)(.*)$/.exec( text )!
					prev = parent[ decodeURIComponent( name ) ] = {}
					if( order ) prev[ '+' ] = order === '+'
					stack.push( parent )

				}
				
			} ,
			
			'filter' : ( filter , chinks , offset )=> {
				
				if( values ) {
					if( range ) {
						range.push( range.pop() + filter )
					} else {
						range = [ filter ]
					}
				} else 
				
				if( prev ) {
					
					values = prev[ filter as '=' | '!=' ] = [] as string[][]
					
				} else {
					
					values = [] as string[][]
					parent[ '' ] = values
					
				}
				
			} ,

			'list_separator' : ( found , chunks , offset )=> {

				if( !range ) fail_at( offset )
				
				values!.push( range! )
				range = null

			} ,
			
			'range_separator' : ( found , chunks , offset )=> {
				
				if( !values ) fail_at( offset )
				
				range = [ range?.[0] ?? '', '' ]
				
			} ,
			
			'fetch_open' : ( found , chunks , offset )=> {

				if( range ) {
					values!.push( range )
					range = null
				}
				
				if( !prev ) fail_at( offset )
				
				parent = prev!
				values = null
				prev = null

			} ,
			
			'fetch_separator': ( found , chunks , offset )=> {
				
				if( range ) {
					values!.push( range )
					range = null
				}
				
				parent = stack.pop()!
				values = null
				prev = null
				
			},
			
			'fetch_close' : ()=> {

				if( range ) {
					values!.push( range )
					range = null
				}
				
				parent = stack.pop()!
				values = null
				prev = null

			} ,

		} )

		if( range ) values!.push( range )
		
		return stack[0]
	}

}
