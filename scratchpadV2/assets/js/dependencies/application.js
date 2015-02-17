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
	.state('viewScratch',{
		url:'/scratchpad/:id/view',
		templateUrl:'templates/viewScratch.html',
		controller:'viewScratchController'
	});
}).run(function($state){
	$state.go('scratchpad');
});



scratchpadModule.controller('scratchListController', function($scope,$state,Notes){
	
	$scope.scratchpad = Notes.query();	
	console.log($scope.scratchpad);

	$scope.deleteScratch = function (scratch) {
		if(confirm("You Clicked DELETE !! Are you sure ?")) {
			scratch.$delete(function() {
				$state.go('scratchpad');
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
        $scope.scratch_reminder = '';
		$scope.scratch.$save(function () {
			$state.go('scratchpad');
		});
	}
	$scope.reminder = function() {
		$scope.scratch_reminder = $scope.scratch.title;
		$scope.scratch.$save(function () {
			$state.go('scratchpad');
		});
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