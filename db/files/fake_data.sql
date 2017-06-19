USE test;
INSERT INTO testtab VALUES(0, "Bob");
INSERT INTO testtab VALUES(0, "Eve");
INSERT INTO testtab VALUES(0, "Alice");

USE prod;

INSERT INTO companies VALUES(1, "Cows and Bows ltd.", "1234567890123", "123456789012");
INSERT INTO companies VALUES(2, "My second company", "3745345765359", "323432844583");
INSERT INTO companies VALUES(3, "Why so serious? (r)", "1111111111111", "111111111111");
INSERT INTO companies VALUES(4, "Why so serious? (tm)", "2222222222222", "222222222222");

INSERT INTO bookings VALUES(0, 3, 2, "2017-06-19", 1);
INSERT INTO bookings VALUES(0, 4, 1, "2017-06-19", 2);
INSERT INTO bookings VALUES(0, 3, 3, "2017-06-19", 3);
INSERT INTO bookings VALUES(0, 4, 1, "2017-06-19", 4);
INSERT INTO bookings VALUES(0, 4, 2, "2017-06-19", 5);
INSERT INTO bookings VALUES(0, 3, 1, "2017-06-19", 6);
INSERT INTO bookings VALUES(0, 3, 2, "2017-06-20", 3);
INSERT INTO bookings VALUES(0, 4, 2, "2017-06-20", 4);
INSERT INTO bookings VALUES(0, 4, 1, "2017-06-20", 5);
INSERT INTO bookings VALUES(0, 4, 2, "2017-06-20", 6);
