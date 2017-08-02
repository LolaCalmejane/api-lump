<?php

/**
 * Created by PhpStorm.
 * User: thomas
 * Date: 25/07/2017
 * Time: 11:05
 */
class CurlTest
{
    public $curl;
    public $result;
    public $status;
    public $error;

    public function init($url, $method, array $params = [])
    {
        $this->curl = curl_init();
        echo "launch test for $url".PHP_EOL;
        $encode = http_build_query($params);
        switch ($method) {
            case 'POST':
                curl_setopt($this->curl, CURLOPT_URL, $url);
                curl_setopt($this->curl, CURLOPT_POST, true);
                curl_setopt($this->curl, CURLOPT_POSTFIELDS, $encode);
                break;
            case 'GET':
                curl_setopt($this->curl, CURLOPT_URL, $url."?".$encode);
                curl_setopt($this->curl, CURLOPT_HTTPGET, true);
                break;
            case 'PUT':
                curl_setopt($this->curl, CURLOPT_URL, $url);
                curl_setopt($this->curl, CURLOPT_PUT, true);
                curl_setopt($this->curl, CURLOPT_HTTPHEADER, ['Content-Length: ' . strlen($encode)]);
                curl_setopt($this->curl, CURLOPT_POSTFIELDS, $encode);
                break;
        }
        return $this;
    }

    public function setOpt(array $options = [], $result = true)
    {
        foreach($options as $const => $option) {
            curl_setopt($this->curl, $const, $option);
        }
        if($result) {
            curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);
        }
        return $this;
    }

    public function execute()
    {
        $result = curl_exec($this->curl);
        if(curl_errno($this->curl)) {
            $this->result = "result: ".$result.PHP_EOL;
            $this->status = 500;
            $this->error = curl_error($this->curl);
        } else {
            $this->result = "result: ".$result.PHP_EOL;
            $this->status = 200;
        }
        echo "status: ".$this->status.PHP_EOL;
        curl_close($this->curl);
        return $this;
    }
}