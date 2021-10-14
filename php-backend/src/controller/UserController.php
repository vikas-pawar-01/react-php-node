<?php

namespace Src\Controller;

use Src\Models\User;

class UserController {

	private $objDatabase;
	private $strRequestMethod;
	private $intUserId;

	private $objUser;

	public function __construct( $objDatabase, $strRequestMethod, $intUserId ) {
		$this->objDatabase      = $objDatabase;
		$this->strRequestMethod = $strRequestMethod;
		$this->intUserId           = $intUserId;

		$this->objUser = new User( $objDatabase );
	}

	public function processRequest() {
		switch( $this->strRequestMethod ) {
			case 'GET':
				if( $this->intUserId ) {
					$arrstrResponse = $this->getUser( $this->intUserId );
				} else {
					$arrstrResponse = $this->getAllUsers();
				};
				break;
			case 'POST':
				$arrstrResponse = $this->createUserFromRequest();
				break;
			case 'PUT':
				$arrstrResponse = $this->updateUserFromRequest( $this->intUserId );
				break;
			case 'DELETE':
				$arrstrResponse = $this->deleteUser( $this->intUserId );
				break;
			default:
				$arrstrResponse = $this->notFoundResponse();
				break;
		}
		header( $arrstrResponse['status_code_header'] );
		if( $arrstrResponse['body'] ) {
			echo $arrstrResponse['body'];
		}
	}

	private function getAllUsers() {
		$arrstrResult                         = $this->objUser->findAll();
		$arrstrResponse['status_code_header'] = 'HTTP/1.1 200 OK';
		$arrstrResponse['body']               = json_encode( $arrstrResult );

		return $arrstrResponse;
	}

	private function getUser( $id ) {
		$result = $this->objUser->find( $id );
		if( !$result ) {
			return $this->notFoundResponse();
		}
		$response['status_code_header'] = 'HTTP/1.1 200 OK';
		$response['body']               = json_encode( $result );

		return $response;
	}

	private function createUserFromRequest() {
		$arrstrInput = $_POST;

		if( !$this->validateUser( $arrstrInput ) ) {
			return $this->unprocessableEntityResponse();
		}

		$this->objUser->insert( $arrstrInput );
		$response['status_code_header'] = 'HTTP/1.1 201 Created';
		$response['body']               = NULL;

		return $response;
	}

	private function updateUserFromRequest( $id ) {
		$arrstrResult = $this->objUser->find( $id );

		if( !$arrstrResult ) {
			return $this->notFoundResponse();
		}

		$arrstrInput = $_POST;

		if( !$this->validateUser( $arrstrInput ) ) {
			return $this->unprocessableEntityResponse();
		}

		$this->objUser->update( $id, $arrstrInput );
		$response['status_code_header'] = 'HTTP/1.1 200 OK';
		$response['body']               = NULL;

		return $response;
	}

	private function deleteUser( $id ) {
		$arrstrResult = $this->objUser->find( $id );
		if( !$arrstrResult ) {
			return $this->notFoundResponse();
		}
		$this->objUser->delete( $id );
		$arrstrResponse['status_code_header'] = 'HTTP/1.1 200 OK';
		$arrstrResponse['body']               = NULL;

		return $arrstrResponse;
	}

	private function validateUser( $arrstrInput ) {

		if( !isset( $arrstrInput['name'] ) || !isset( $arrstrInput['email'] ) ) {
			return false;
		}

		return true;
	}

	private function unprocessableEntityResponse() {
		$arrstrResponse['status_code_header'] = 'HTTP/1.1 422 Unprocessable Entity';
		$arrstrResponse['body']               = json_encode( [
			'error' => 'Invalid input'
		] );

		return $arrstrResponse;
	}

	private function notFoundResponse() {
		$arrstrResponse['status_code_header'] = 'HTTP/1.1 404 Not Found';
		$arrstrResponse['body']               = NULL;

		return $arrstrResponse;
	}
}