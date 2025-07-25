const isAuthenticated = (req, res, next) => {
  console.log("--- DEBUG isAuthenticated ---");
  console.log("req.session:", req.session); // Mostra o objeto da sessão completo
  console.log("req.session.user:", req.session.user); // Mostra o valor de req.session.user
  if (req.session.user === undefined) {
    console.log("Resultado: Usuário NÃO logado. Acesso negado (401).");
    return res.status(401).json({ message: "You do not have access" });
  }
  console.log("Resultado: Usuário logado. Acesso permitido.");
  next();
};

module.exports = { isAuthenticated };
