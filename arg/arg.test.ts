namespace $ {
	
	$mol_test_mocks.push( $ => {
		
		class $hyoo_harp_arg_mock extends $hyoo_harp_arg {

			static $ = $
			
			@ $mol_mem
			static uri( next = '' ) { return next }
	
		}
		
		$.$hyoo_harp_arg = $hyoo_harp_arg_mock
	} )

}
