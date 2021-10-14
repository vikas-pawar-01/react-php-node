<?php

namespace Src\Controller;

use Src\Models\Notification;

class NotificationController {

	private $objDatabase;
	private $strRequestMethod;

	private $objNotification;

	public function __construct( $objDatabase, $strRequestMethod ) {
		$this->objDatabase      = $objDatabase;
		$this->strRequestMethod = $strRequestMethod;

		$this->objNotification = new Notification( $objDatabase );
	}

	public function processRequest() {
		switch( $this->strRequestMethod ) {
			case 'GET':
				$arrstrResponse = $this->getAllNotifications();
				break;
			case 'POST':
				$arrstrResponse = $this->createNotificationFromRequest();
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

	private function getAllNotifications() {
		$arrstrResult                         = $this->objNotification->findAll();
		$arrstrResponse['status_code_header'] = 'HTTP/1.1 200 OK';
		$arrstrResponse['body']               = json_encode( $arrstrResult );

		return $arrstrResponse;
	}

	private function createNotificationFromRequest() {
		$arrstrInput = $_POST;

		if( !$this->validateNotification( $arrstrInput ) ) {
			return $this->unprocessableEntityResponse();
		}

		$this->objNotification->insert( $arrstrInput );
		$response['status_code_header'] = 'HTTP/1.1 201 Created';
		$response['body']               = NULL;

		return $response;
	}

	private function validateNotification( $arrstrInput ) {

		if( !isset( $arrstrInput['name'] ) ) {
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