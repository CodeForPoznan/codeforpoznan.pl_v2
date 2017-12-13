<?php
// Check for empty fields
if(empty($_POST['name'])  		||
   empty($_POST['email']) 		||
   empty($_POST['phone']) 		||
   empty($_POST['message'])	||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
	echo "No arguments Provided!";
	return false;
   }
	
$name = strip_tags(htmlspecialchars($_POST['name']));
$email_address = strip_tags(htmlspecialchars($_POST['email']));
$phone = strip_tags(htmlspecialchars($_POST['phone']));
$message = strip_tags(htmlspecialchars($_POST['message']));
	
// Create the email and send the message
$to = 'hello@codeforpoznan.pl'; // Add your email address inbetween the '' replacing hello@codeforpoznan.pl - This is where the form will send a message to.
$email_subject = "Formularz kontaktowy Code For Poznan:  $name";
$email_body = "Otrzymałeś nową wiadomość z formularza kontaktowego codeforpoznan.pl.\n\n"."Oto szczegóły:\n\nImię: $name\n\nEmail: $email_address\n\nTelefon: $phone\n\nMessage:\n$message";
$headers = "From: noreply@codeforpoznan.pl\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com;
$headers .= "Reply - to : $email_address";
mail($to,$email_subject,$email_body,$headers);
return true;			
?>
