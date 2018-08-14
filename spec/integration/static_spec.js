const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : static", () => {

//#1 In our first describe block, we set the title for the test suite to match the HTTP verb and route it will test. We will nest describe calls for the static pages of our application here. The first one will be on our landing page which will serve as the root of our application. As a good practice, we title our route tests with the HTTP verb the request will make along with the URI for the request.
  describe("GET /", () => {

//#2 Our first spec will test that when requesting the server using that route, we get a status code 200 indicating that the request was successful.
    it("should return status code 200", (done) => {

//#3We use request to send a GET request to the base URL. All request making methods take a function as a second argument which will contain the response from the server as well as content and any errors. We set the expectation that the  statusCode property of the response should be 200.
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);

//#4 We finally call the done method to let Jasmine know our test is completed. This is necessary because our test is making an asynchronous request to the server which will not complete before the spec is executed. If we remove the done parameter on the spec implementation function as well as the done() method call, our test will pass. This is because the expect call won't be made before the test finishes and Jasmine assumes that no expect means the test is successful. Passing done as a parameter to the function tells Jasmine to wait until it is called.
        done();
      });
    });

  });
});
