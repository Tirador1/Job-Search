import { faker } from "@faker-js/faker";

describe("UpdateCompany API", () => {
  it("Update Company", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:5000/companies/updateCompany/66245087b85961944147d270",
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
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property("success", true);
      expect(response.body).to.have.property(
        "message",
        "Company updated successfully"
      );
      cy.log(JSON.stringify(response.body));
    });
  });
});
