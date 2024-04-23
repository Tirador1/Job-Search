import { faker } from "@faker-js/faker";

describe("CreateCompany", () => {
  it("Create Company", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:5000/companies/createCompany",
      headers: {
        "Content-Type": "application/json",
        accesstoken:
          "accesstoken__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI0MzY0ODgzMWRiMDRmODQzYWZkNjIiLCJpYXQiOjE3MTM2NDkzNDYsImV4cCI6MTcxMzczNTc0Nn0.CIGY4S5T90YmSkZ5Ocq1OaJqEuucR4rxuq3f1HvYq_c",
      },
      body: {
        companyName: faker.company.name(),
        description: faker.company.catchPhrase(),
        industry: "IT",
        address: faker.location.streetAddress(),
        numberOfEmployees: faker.number.int(100),
        companyEmail: faker.internet.email(),
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property("success", true);
      expect(response.body).to.have.property(
        "message",
        "Company created successfully"
      );
      cy.log(JSON.stringify(response.body));
    });
  });

  it("Create Company with invalid data", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:5000/companies/createCompany",
      headers: {
        "Content-Type": "application/json",
        accesstoken:
          "accesstoken__eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjI0MzY0ODgzMWRiMDRmODQzYWZkNjIiLCJpYXQiOjE3MTM2NDkzNDYsImV4cCI6MTcxMzczNTc0Nn0.CIGY4S5T90YmSkZ5Ocq1OaJqEuucR4rxuq3f1HvYq_c",
      },
      body: {
        companyName: faker.company.name(),
        description: faker.company.catchPhrase(),
        industry: "IT",
        address: faker.location.streetAddress(),
        numberOfEmployees: faker.number.int(100),
        companyEmail: "invalidemail",
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property("message", "Something went wrong");
      cy.log(JSON.stringify(response.body));
    });
  });

  it("Create Company without accesstoken", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:5000/companies/createCompany",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        companyName: faker.company.name(),
        description: faker.company.catchPhrase(),
        industry: "IT",
        address: faker.location.streetAddress(),
        numberOfEmployees: faker.number.int(100),
        companyEmail: faker.internet.email(),
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property("message", "Something went wrong");
      expect(response.body).to.have.property(
        "error_msg",
        "Access token is required"
      );
      cy.log(JSON.stringify(response.body));
    });
  });

  it("Create Company with invalid accesstoken", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:5000/companies/createCompany",
      headers: {
        "Content-Type": "application/json",
        accesstoken: "invalidaccesstoken",
      },
      body: {
        companyName: faker.company.name(),
        description: faker.company.catchPhrase(),
        industry: "IT",
        address: faker.location.streetAddress(),
        numberOfEmployees: faker.number.int(100),
        companyEmail: faker.internet.email(),
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.body).to.have.property("message", "Something went wrong");
      expect(response.body).to.have.property(
        "error_msg",
        "Invalid access token"
      );
      cy.log(JSON.stringify(response.body));
    });
  });
});
