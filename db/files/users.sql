CREATE USER site@'%' IDENTIFIED BY '123123';
GRANT ALL ON *.* TO site@'%';

FLUSH PRIVILEGES;