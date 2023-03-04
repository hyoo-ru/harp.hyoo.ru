namespace $ {
	
	$mol_test({
		
		'type safe build & parse'() {
			
			enum States {
				opened = 'opened',
				closed = 'closed',
			}
			
			const State = $hyoo_harp_scheme( {}, $mol_data_enum( 'States', States ) )
			const Str = $hyoo_harp_scheme( {}, $mol_data_string )
			const Bool = $hyoo_harp_scheme( {}, $mol_data_boolean )
			
			const Repository = $hyoo_harp_scheme({
				name: $mol_data_optional( Str ),
				isPrivate: $mol_data_optional( Bool ),
				// pullRequests: PullRequest,
			})
			
			const PullRequest = $hyoo_harp_scheme({
				state: $mol_data_optional( State ),
				updated_at: $mol_data_optional( Str ),
				repository: $mol_data_optional( Repository ),
			})
			
			const Request = $hyoo_harp_scheme({
				pullRequest: $mol_data_optional( PullRequest ),
			})
			
			const uri = 'pullRequest(state=closed=;-updated_at;repository(name;isPrivate);_num=0@100=)'
			
			let query = Request({
				pullRequest: {
					state: { '=': [[ States.closed ]] }, // filter
					updated_at: { '+': false }, // order
					repository: { // fetch
						name: {},
						isPrivate: {},
					},
					_num: { '=': [[ 0, 100 ]] }, // slice
				}
			})
			
			$mol_assert_like( uri, Request.build( query ) )
			$mol_assert_like( query, Request.parse( uri ) )
			
		},
		
	})
	
}
