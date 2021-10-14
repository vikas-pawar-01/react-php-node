<?php

namespace Src\Models;

class Notification {

	private $objDatabase = NULL;

	public function __construct( $db ) {
		$this->objDatabase = $db;
	}

	public function findAll() {
		$strSql = "SELECT 
			                n.id, n.name, n.user_id, u.name as user_name
			            FROM
			                notifications n
			                LEFT JOIN users u ON u.id = n.user_id;";

		try {
			$row          = $this->objDatabase->query( $strSql );
			$arrstrResult = $row->fetchAll( \PDO::FETCH_ASSOC );

			return $arrstrResult;
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}

	public function find( $id ) {
		$strSql = "SELECT 
			                id, name
			            FROM
			                notifications
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
		$strSql = "INSERT INTO notifications
		                (name, user_id)
		            VALUES
		                (:name, :user_id);";

		try {
			$strSql = $this->objDatabase->prepare( $strSql );
			$strSql->execute( [
				'name' => $input['name'],
				'user_id' => $input['user_id'] ?? NULL,
			] );

			return $strSql->rowCount();
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}

	public function update( $id, array $input ) {
		$strSql = "UPDATE notifications
			            SET 
			                name = :name
			            WHERE id = :id;";

		try {
			$strSql = $this->objDatabase->prepare( $strSql );
			$strSql->execute( [
				'id'   => (int) $id,
				'name' => $input['name'],
			] );

			return $strSql->rowCount();
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}

	public function delete( $id ) {
		$strSql = "DELETE FROM 
							notifications
                        WHERE id = :id;";

		try {
			$strSql = $this->objDatabase->prepare( $strSql );
			$strSql->execute( [ 'id' => $id ] );

			return $strSql->rowCount();
		} catch( \PDOException $e ) {
			exit( $e->getMessage() );
		}
	}
}