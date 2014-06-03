var imageSearch = angular.module('imageSearch', ['ngResource']);

// Tells Angular to use pushState.
imageSearch.config(function($locationProvider) {
	$locationProvider.html5Mode(true);
});


/**
 * Service to retrieve a an array of photos.
 */
imageSearch.service('photos', function($resource) {
	// Uses JSONP to retrieve images since flickr doesn't support CORS.
  return $resource(
  	'http://api.flickr.com/services/feeds/photos_public.gne',
   	{
   		'format': 'json',
   		// Angular replaces 'JSON_CALLBACK' with generated function name.
   		'jsoncallback': 'JSON_CALLBACK'
   	}, {
   		'load': {
   			'method': 'JSONP'
   		}
   	});
});


imageSearch.controller('SearchCtrl', function($scope, $location, photos) {
  $scope.query = '';
	$scope.selectedPhotoIndex;

	/**
	 * Displays image results from Flickr.
	 */
	$scope.getImages = function() {
		// TODO(charleswalton): Check for bad queries.
		var query = $scope.query;
	  $location.search({'q': query});

	  // TODO(charleswalton): This is ugly – would be better to encapsulate the
	  // 'tags' part into the photos service.
		$scope.results = photos.load({ 'tags': query });
	};

	// Shows the selected image in a lightbox of sorts.
	$scope.showItem = function(imageIndex) {
		$scope.selectedPhotoIndex = imageIndex;
	};


	$scope.closeOverlay = function() {
		$scope.selectedPhotoIndex = -1;
	};


	// TODO(charleswalton): Handle Escape + arrow keys for navigation.
	$scope.handleShortcuts = function(e) {
		console.log(e);
	};


	// Sets the default value for query from URL param.
	// TODO(charleswalton): Should do this in another lifecycle event, e.g. init.
	var defaultQuery = $location.search()['q'];
	if (defaultQuery) {
		$scope.query = defaultQuery;
		$scope.getImages();
	}
});