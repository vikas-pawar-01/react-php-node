<?php

namespace Src\Controller;

use Src\Models\User;

class AuthController {

	private $objDatabase;
	private $strRequestMethod;

	private $objUser;

	public function __construct( $objDatabase, $strRequestMethod ) {
		$this->objDatabase      = $objDatabase;
		$this->strRequestMethod = $strRequestMethod;

		$this->objUser = new User( $objDatabase );
	}

	public function processRequest() {
		switch( $this->strRequestMethod ) {
			case 'POST':
				$arrstrResponse = $this->loginUser();
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

	private function loginUser() {
		$arrstrInput = $_POST;

		if( !$this->validateUser( $arrstrInput ) ) {
			return $this->unprocessableEntityResponse();
		}

		$result = $this->objUser->login( $arrstrInput );

		$arrstrResponse['status_code_header'] = 'HTTP/1.1 200 OK';
		$arrstrResponse['body']               = json_encode( $result );

		return $arrstrResponse;
	}

	private function validateUser( $arrstrInput ) {

		if( !isset( $arrstrInput['email'] ) || !isset( $arrstrInput['password'] ) ) {
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
}