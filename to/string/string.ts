namespace $ {
	
	export function $hyoo_harp_to_string< Query extends $hyoo_harp_query >( query: Query ): string {

		return Object.entries( query ).map( ([ field, harp ])=> {
			
			if( field === '+' ) return ''
			if( field === '=' ) return ''
			if( field === '!=' ) return ''
			if( !harp ) return ''
			
			const harp2 = harp as $hyoo_harp_query<any>
			
			const order = harp2['+'] === true ? '+' : harp2['+'] === false ? '-' : ''
			const filter = harp2['='] ? '=' : harp2['!='] ? '!=' : ''
			const name = encodeURIComponent( field )
			
			let values = ( ( harp2['='] || harp2['!='] || [] ) as unknown[][] ).map( ([ min , max ]) => {

				if( max === undefined || min === max ) return encodeURIComponent( String( min ) ) + '='
				
				min = ( min === undefined ) ? '' : encodeURIComponent( String( min ) )
				max = ( max === undefined ) ? '' : encodeURIComponent( String( max ) )
				
				return `${ min }@${ max }=`

			} ).join( '' )
			
			let fetch = $hyoo_harp_to_string( harp as $hyoo_harp_query )
			if( fetch ) fetch = `(${fetch})`

			return `${order}${name}${filter}${values}${fetch}`
			
		}).filter( Boolean ).join( ';' )

	}

}
