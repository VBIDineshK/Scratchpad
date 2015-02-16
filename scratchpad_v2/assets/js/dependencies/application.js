var scratchpadModule = angular.module('scratchpad',['ui.router','ngResource']);

scratchpadModule.config(function($stateProvider,$httpProvider) {
	
	$stateProvider.state('scratchpad',{
		url:'/scratchpad',
		templateUrl:'templates/scratchpad.html',
		controller:'scratchListController'
	})
	.state('addNewScratch',{
		url:'/addNewScratch',
		templateUrl:'templates/addNewScratch.html',
		controller:'addScratchController'
	})
	.state('scratchpad.viewScratch',{
		url:'/scratchpad/:id/view',
		templateUrl:'templates/viewScratch.html',
		controller:'viewScratchController'
	})
	.state('addNewScratch.emailScratch',{
		url:'/emailScratch',
		templateUrl:'templates/emailScratch.html',
		controller:'addScratchController'
	})
	;
}).run(function($state){
	$state.go('scratchpad');
});



scratchpadModule.controller('scratchListController', function($scope,$state,Notes){
	
	$scope.scratchpad = Notes.query();

	$scope.deleteScratch = function (scratch) {
		if(confirm("You Clicked DELETE !! Are you sure ?")) {
			scratch.$delete(function() {
				window.location.href = 'http://localhost:1337';
			});
		}
	}
})

.controller('viewScratchController', function($scope,$stateParams,Notes){
	
	$scope.scratch = Notes.get({id:$stateParams.id});
})

.controller('addScratchController', function($scope,$state,Notes){
	
	$scope.scratch = new Notes();

	$scope.addScratch = function() {
        $scope.scratch.time = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
		$scope.scratch.$save(function () {
			$state.go('scratchpad');
		});
	}
	$scope.emailScratch = function() {

				/*Email using mandrill*/
			$.ajax({
      		type: 'POST',
		      url: 'https://mandrillapp.com/api/1.0/messages/send.json',
		      data: {
		        'key': 'u1IAL_R9ZDaboyElRz9TMQ',
		        'message': {
		          'from_email': 'YOURSCRATCH@scratchpad.com',
		          'to': [
		              {
		                'email': 'anshumanv@visualbi.com',
		                'name': 'Dinesh Kannan',
		                'type': 'to'
		              }
		            ],
		          'autotext': 'false',
		          'subject': $scope.scratch.title,
		          'html': $scope.scratch.content		       
		           }
		      }
		     }).done(function(response) {
		       console.log(response); 
		     });
				/*Email using mandrill*/
				$scope.addScratch();
		
	

	}
})
;






scratchpadModule.factory('Notes', function($resource){
	return $resource('http://localhost:1337/scratchpadAPI/:id', {id:'@id'}, {

		update: {
			method:'PUT'
		}
	});
});