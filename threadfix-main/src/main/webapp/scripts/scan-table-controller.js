var myAppModule = angular.module('threadfix')

myAppModule.controller('ScanTableController', function ($scope, $window, $http, $log, $rootScope) {

    $scope.heading = '0 Scans';
//    $scope.csrfToken = $scope.$parent.$csrfToken;

    $scope.refresh = function() {

    }

    $scope.deleteScan = function(scan) {

        scan.deleting = true;

        if (confirm('Are you sure you want to delete this scan?')) {
            $http.post($window.location.pathname + '/scans/' + scan.id + '/delete' + $scope.csrfToken).
                success(function(data, status, headers, config) {

                    if (data.success) {
                        var index = $scope.scans.indexOf(scan);

                        if (index > -1) {
                            $scope.scans.splice(index, 1);
                        }

                        if ($scope.scans.length === 0) {
                            $scope.heading = '0 Scans';
                        }
                        $rootScope.$broadcast('scanDeleted', $scope.scans.length > 0);

                    } else {
                        scan.deleting = false;
                        $scope.errorMessage = "Something went wrong. " + data.message;
                    }
                }).
                error(function(data, status, headers, config) {
                    $log.info("HTTP request for form objects failed.");
                    // TODO improve error handling and pass something back to the users
                    scan.deleting = false;
                    $scope.errorMessage = "Request to server failed. Got " + status + " response code.";
                });
        }
    };

    $scope.viewScan = function(scan) {
        window.location.href = $window.location.pathname + '/scans/' + scan.id + $scope.csrfToken;
    };

    var setDate = function(scan) {
        var time = new Date(scan.importTime)
        scan.importTime = (time.getMonth() + "/" + time.getDate() + "/" + time.getFullYear() + " " + time.getHours() + ":" + time.getMinutes());
    }

    $scope.$on('scans', function(event, scans) {
        $scope.scans = scans;
        $scope.scans.forEach(setDate);
        if (!$scope.scans || !$scope.scans.length > 0) {
            $scope.scans = undefined;
        } else {
            if ($scope.scans.length === 1) {
                $scope.heading = '1 Scan';
            } else {
                $scope.heading = $scope.scans.length + ' Scans';
            }
        }

    });


});