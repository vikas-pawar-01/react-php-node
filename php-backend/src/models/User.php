<?php

namespace Src\Models;

class User {

	private $objDatabase = NULL;

	public function __construct( $db ) {
		$this->objDatabase = $db;
	}

	public function findAll() {
		$strSql = "SELECT 
			                id, name, email, password
			            FROM
			                users;";

		try {
			$row    = $this->objDatabase->query( $strSql );
			$arrstrResult = $row->fetchAll( \PDO::FETCH_ASSOC );

			return $arrstrResult;
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}

	public function find( $id ) {
		$strSql = "SELECT 
			                id, name, email, password
			            FROM
			                users
			            WHERE id = ?;";

		try {
			$arrstrRow = $this->objDatabase->prepare( $strSql );
			$arrstrRow->execute( [ $id ] );
			$arrstrResult = $arrstrRow->fetchAll( \PDO::FETCH_ASSOC );

			return $arrstrResult;
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}

	public function insert( array $input ) {
		$strSql = "INSERT INTO users
		                (name, email, password)
		            VALUES
		                (:name, :email, :password);";

		try {
			$strSql = $this->objDatabase->prepare( $strSql );
			$strSql->execute( [
				'name'     => $input['name'],
				'email'    => $input['email'],
				'password' => $input['password'] ?? NULL,
			] );

			return $strSql->rowCount();
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}

	public function update( $id, array $input ) {
		$strSql = "UPDATE users
			            SET 
			                name = :name,
			                email  = :email
			            WHERE id = :id;";

		try {
			$strSql = $this->objDatabase->prepare( $strSql );
			$strSql->execute( [
				'id'       => (int) $id,
				'name'     => $input['name'],
				'email'    => $input['email'],
			] );

			return $strSql->rowCount();
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}

	public function delete( $id ) {
		$strSql = "DELETE FROM 
							users
                        WHERE id = :id;";

		try {
			$strSql = $this->objDatabase->prepare( $strSql );
			$strSql->execute( [ 'id' => $id ] );

			return $strSql->rowCount();
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}

	public function login( array $input ) {

		$strSql = "SELECT 
			                id, name, email
			            FROM
			                users
			            WHERE 
			                email = :email 
			                AND password = :password;";
		try {
			$arrstrRow = $this->objDatabase->prepare( $strSql );
			$arrstrRow->execute( [
				':email'    => $input['email'],
				':password' => $input['password']
			] );

			$arrstrResult = $arrstrRow->fetchAll( \PDO::FETCH_ASSOC );

			return $arrstrResult;
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}
}