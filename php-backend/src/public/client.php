<?php
require "../bootstrap.php";

$clientId     = $_ENV[ 'OKTACLIENTID' ];
$clientSecret = $_ENV[ 'OKTASECRET' ];
$scope        = $_ENV[ 'SCOPE' ];
$issuer       = $_ENV[ 'OKTAISSUER' ];

$token = obtainToken( $issuer, $clientId, $clientSecret, $scope );

getAllUsers( $token );
getUser( $token, 100 );

function obtainToken( $issuer, $clientId, $clientSecret, $scope ) {
	echo "Obtaining token...";

	// prepare the request
	$uri     = $issuer . '/v1/token';
	$token   = base64_encode( "$clientId:$clientSecret" );
	$payload = http_build_query( [
		'grant_type' => 'client_credentials',
		'scope'      => $scope
	] );

	// build the curl request
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, $uri );
	curl_setopt( $ch, CURLOPT_HTTPHEADER, [
		'Content-Type: application/x-www-form-urlencoded',
		"Authorization: Basic $token"
	] );
	curl_setopt( $ch, CURLOPT_POST, 1 );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, $payload );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );

	// process and return the response
	$response = curl_exec( $ch );
	$response = json_decode( $response, true );
	if( !isset( $response['access_token'] )
	    || !isset( $response['token_type'] ) ) {
		exit( 'failed, exiting.' );
	}

	echo "success!\n";

	// here's your token to use in API requests
	return $response['token_type'] . " " . $response['access_token'];
}

function getAllUsers( $token ) {
	echo "Getting all users...";
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, "http://localhost:8000/user" );
	curl_setopt( $ch, CURLOPT_HTTPHEADER, [
		'Content-Type: application/json',
		"Authorization: $token"
	] );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	$response = curl_exec( $ch );

	var_dump( $response );
}

function getUser( $token, $id ) {
	echo "Getting user with id#$id...";
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, "http://localhost:8000/user/" . $id );
	curl_setopt( $ch, CURLOPT_HTTPHEADER, [
		'Content-Type: application/json',
		"Authorization: $token"
	] );
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	$response = curl_exec( $ch );

	var_dump( $response );
}