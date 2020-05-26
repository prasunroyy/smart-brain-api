const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body; //destructuring
  if (!email || !name || !password) {
    return res.status(400).json("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      //  .returning("email")
      .then((loginEmail) => {
        // console.log(loginEmail);
        return (
          trx("users")
            //.returning("*")
            .insert({
              email: email,
              name: name,
              joined: new Date(),
            })
            .then(() => {
              // console.log(user);
              // res.json(user[0]);
              db.select("*")
                .from("users")
                .where("email", "=", req.body.email)
                .then((user) => {
                  console.log(user);
                  res.json(user[0]);
                });
              //.catch((err) => res.status(400).json("unable to register"));
            })
        );
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
};
module.exports = {
  handleRegister: handleRegister,
};
