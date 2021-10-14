<?php
header( "Access-Control-Allow-Origin: *" );
header( "Content-Type: application/json; charset=UTF-8" );
header( "Access-Control-Allow-Methods: OPTIONS, HEAD, TRACE, GET, POST, PUT, PATCH, DELETE" );
header( "Access-Control-Max-Age: 86400" );
header( "Access-Control-Allow-Headers: Origin-, X-PINGOTHER, X-Requested-With, X-Custom-Information, Content-Type, Accept, Authorization" );

require "../bootstrap.php";

$arrstrUri = parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );
$arrstrUri = explode( '/', $arrstrUri );

// OKTA authenication
//if( !authenticate() ) {
//	header( "HTTP/1.1 401 Unauthorized" );
//	exit( 'Unauthorized' );
//}

$strRequestMethod = isset( $_POST["_method"] ) ? $_POST["_method"] : 'GET';

switch( $arrstrUri[1] ) {
	case 'user':
		$intUserId = NULL;
		if( isset( $arrstrUri[2] ) ) {
			$intUserId = (int) $arrstrUri[2];
		}

		$objController = new Src\Controller\UserController( ( new Src\System\DatabaseConnector() )->getConnection(), $strRequestMethod, $intUserId );
		$objController->processRequest();
		break;

	case 'notification':
		$objController = new Src\Controller\NotificationController( ( new Src\System\DatabaseConnector() )->getConnection(), $strRequestMethod );
		$objController->processRequest();
		break;

	case 'auth':
		$objController = new Src\Controller\AuthController( ( new Src\System\DatabaseConnector() )->getConnection(), $strRequestMethod );
		$objController->processRequest();
		break;

	default:
		header( "HTTP/1.1 404 Not Found" );
		exit();
}

function authenticate() {
	try {
		switch( true ) {
			case array_key_exists( 'HTTP_AUTHORIZATION', $_SERVER ) :
				$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
				break;
			case array_key_exists( 'Authorization', $_SERVER ) :
				$authHeader = $_SERVER['Authorization'];
				break;
			default :
				$authHeader = NULL;
				break;
		}
		preg_match( '/Bearer\s(\S+)/', $authHeader, $matches );
		if( !isset( $matches[1] ) ) {
			throw new \Exception( 'No Bearer Token' );
		}
		$jwtVerifier = ( new \Okta\JwtVerifier\JwtVerifierBuilder() )
			->setIssuer( $_ENV['OKTAISSUER'] )
			->setAudience( 'api://default' )
			->setClientId( $_ENV['OKTACLIENTID'] )
			->build();

		return $jwtVerifier->verify( $matches[1] );
	} catch( \Exception $e ) {
		return false;
	}
}