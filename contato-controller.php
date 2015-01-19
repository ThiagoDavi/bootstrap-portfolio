<?php
use \utils\Email;
use \utils\Connection;

require("utils/Ambiente.php");
require("utils/Database.php");
require("utils/Connection.php");
require("utils/Email.php");
require("phpmailer/class.phpmailer.php");

switch ($_GET['faz'])
{
	case "contato":
		

		$arrayLabels = array
		(
			"name" => "Nome",
			"email" => "Email",
			"phone" => "Telefone",
			"message" => "Mensagem",
		
		);

		$arrayCamposObrigatorios = array("name", "email", "phone", "message");

		////////////////////////////////////////////////////////////////////////////////////

		/////////////////////////////////#PARAMETROS////////////////////////////////////////


		////////////////////////////////////////////////////////////////////////////////////

		///////////////////////////////////////#SEND////////////////////////////////////////

		clearEmptyInput($arrayDefaultValue);

		if (checkRequired($arrayCamposObrigatorios)) {
			foreach ($arrayLabels as $key => $value) {
				if ($_POST[$key]) {
					$mensagemEnvio .= "<strong>" . utf8_decode($value) . ":</strong> " . nl2br(utf8_decode($_POST[$key])) . " <br/>";
				}
			}

			$mensagemEnvio = "
		=================================<br />
		<strong>" . utf8_decode('CONTATO - SITE EXECUTIVE CHECKUP') . "</strong><br />
		=================================<br /><br />" . $mensagemEnvio;

			$mail = new PHPMailer(true);

			switch (Email::TYPEMAIL) {
				case "smtp":
					$mail->IsSMTP();
					break;
				case "sendmail":
					$mail->IsSendmail();
					break;
			}

			try {
				if (Email::TYPEMAIL == "smtp") {
					$mail->Host = Email::HOSTMAIL;

					$mail->SMTPDebug = false;

					$mail->Username = Email::USERNAMESMTP;
					$mail->Password = Email::PASSWORDSMTP;

					if (Email::MAILAUTH) {
						$mail->SMTPAuth = true;
					}
				}

				if (Email::PORTMAIL) {
					$mail->Port = Email::PORTMAIL;
				}

				if (Email::SSLMAIL) {
					$mail->SMTPSecure = "ssl";
				}

				if (Email::TLSMAIL) {
					$mail->SMTPSecure = 'tls';
				}

				$mail->FromName = utf8_decode($_POST['nome']);
				$mail->From = Email::FROMMAIL;
				$mail->AddReplyTo($_POST['email'],$_POST['nome']);

				foreach ($arrayEmails as $value) {
					$mail->AddAddress($value);
				}

				$mail->Subject = utf8_decode("EXECUTIVE CHECKUP | CONTATO");
				$mail->Body = $mensagemEnvio;
				$mail->isHTML(true);
				$mail->Send();

				$arrayJson['msg'] = "mensagem enviada!";
				$arrayJson['status'] = "true";

			} catch (phpmailerException $e) {
				$MSG = $e->errorMessage();
				$arrayJson['msg'] = "falha ao enviar (erro 1001)";
				$arrayJson['status'] = "false";
			} catch (Exception $e) {
				$MSG = $e->getMessage();
				$arrayJson['msg'] = "falha ao enviar (erro 1002)";
				$arrayJson['status'] = "false";
			}
		} else {
			$arrayJson['msg'] = "preencha os campos obrigatórios!";
			$arrayJson['status'] = "false";
		}
		break;


}


echo json_encode($arrayJson);