namespace $ {
	
	const Int = $mol_data_pipe( $mol_data_variant( $mol_data_string, $mol_data_integer ), Number )
	
	export function $hyoo_harp_scheme<
		Sub extends Record< string , $mol_data_value< any, any > >,
		Value extends $mol_data_value< any, any > = typeof $mol_data_integer,
	>( sub: Sub, value = $mol_data_integer as Value ) {
		
		const inner = $mol_data_optional( $mol_data_record( sub ) ) as $mol_data_value<
			undefined | Readonly<{ [Key in keyof Sub ]: Parameters< Sub[Key] >[0] }>,
			undefined | Readonly<{ [Key in keyof Sub ]: ReturnType< Sub[Key] > }>
		>
		
		const values = $mol_data_optional( $mol_data_array( $mol_data_array( value ) ) )
		
		const val = $mol_data_record({
			... sub,
			'+': $mol_data_optional( $mol_data_boolean ),
			'=': values,
			'!=': values,
			'_num': $mol_data_optional( $mol_data_record({
				'=': $mol_data_array( $mol_data_array( Int ) )
			}) ),
			'_len': inner,
			'_max': inner,
			'_min': inner,
			'_sum': inner,
		})
		
		return Object.assign( val, {
			
			parse( str: string ) {
				return val( $hyoo_harp_from_string( str ) as any )
			},
			
			build( query: Parameters< typeof val >[0] ) {
				return $hyoo_harp_to_string( query as any )
			},
			
		} )
		
	}
	
}
