<?php 
session_start();
 
if($_SERVER['REQUEST_METHOD']=="POST"){
   
            $key =ini_get("session.upload_progress.prefix") . "123";
            //print_r($_SESSION);
            if(isset($_SESSION[$key]) && isset($_SESSION[$key]["content_length"]) && isset($_SESSION[$key]["bytes_processed"]) ){
                $_SESSION["upload_started"]=1;
                $content_length=$_SESSION[$key]["content_length"];
                $bytes_processed=$_SESSION[$key]["bytes_processed"];
                $percent_complete=ceil(($bytes_processed/$content_length) * 100);
                if($percent_complete=="100"){
                     unset($_SESSION["upload_started"]);
                }
                echo $percent_complete;
            }
            else {
                if(isset($_SESSION["upload_started"]) && $_SESSION["upload_started"]=="1"){
                    echo "100";
                    unset($_SESSION["upload_started"]);
                    exit();
                }
               // echo "error1";
            }
            //echo "<pre>"; 
            //print_r($_POST["field_id"]);
 }
  else {
    echo "error";
}
exit();