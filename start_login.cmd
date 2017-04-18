if "%COMPUTERNAME%" == "ANDRECLEVO" set NODE=192.168.2.10
concurrently "react-scripts start" "node server\server"
