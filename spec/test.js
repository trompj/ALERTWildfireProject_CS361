describe('Login Test', function() {

    describe("when login is used to perform login", function () {

        it('should login correctly with valid username/password', function () {
            expect(loginAuthenticate("public", "password")).toEqual(true);
        });

        it('should not login with valid username/invalid password', function () {
            expect(loginAuthenticate("public", "wrong")).toEqual(false);
        });

        it('should not login correctly with invalid username/valid password', function () {
            expect(loginAuthenticate("wrong", "password")).toEqual(false);
        });

        it('should not login correctly with invalid username/invalid password', function () {
            expect(loginAuthenticate("wrong", "wrong")).toEqual(false);
        });

    });
});