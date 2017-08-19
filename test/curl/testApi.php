<?php
/**
 * Created by PhpStorm.
 * User: thomas
 * Date: 02/08/2017
 * Time: 10:51
 */

require_once 'CurlTest.php';

$curl = new CurlTest();
/*
$request = $curl->init('http://localhost:3000/api/1.0/user/search', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'login' => 'tho'
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/user/create', 'POST',
    [
        'email' => 'dupont2.thomas70@gmail.com',
        'login' => 'thomas3',
        'password' => 'test'
    ])
    ->setOpt()
    ->execute();
echo $request->result;



$request = $curl->init('http://localhost:3000/api/1.0/friend/add/5981c8d13777dc60de73b26c', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e")
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/user/login/', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e")
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/friend/list/', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'ids' => ["5981bc0a95d2ef4fc943474e","5981c8d13777dc60de73b26c"]
    ])
    ->setOpt()
    ->execute();
echo $request->result;

$request = $curl->init('http://localhost:3000/api/1.0/friend/delete/5981bc0a95d2ef4fc943474e', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e")
    ])
    ->setOpt()
    ->execute();
echo $request->result;
*/
$request = $curl->init('http://localhost:3000/api/1.0/music/search', 'GET',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        'search' => "rihanna diaman"
    ])
    ->setOpt()
    ->execute();
echo $request->result;
/*
$request = $curl->init('http://localhost:3000/api/1.0/music/add/music', 'POST',
    [
        'authorization' => base64_encode("thomas:a1z2e"),
        "videoId" => "lWA2pjMjpBs",
        "title"=>"Rihanna - Diamonds",
        "channel"=>"RihannaVEVO"
    ])
    ->setOpt()
    ->execute();
echo $request->result;
*/
