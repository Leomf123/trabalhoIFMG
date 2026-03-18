// Listar produtos do usuário logado
exports.index = async (req, res) => {
    try {
        // Verificar se usuário está logado
        if (!req.session.user) {
            req.flash('errors', 'Você precisa estar logado para acessar seus produtos');
            return res.redirect('/login/index');
        }

        const usuarioId = req.session.user.id;

        // TODO: Buscar produtos do banco de dados quando estiver pronto
        // Por enquanto, usando produtos fictícios para teste
        const produtosFake = [
            {
                id: 1,
                nome: "Brownie de Doce de Leite",
                descricao: "Brownie recheado com doce de leite artesanal.",
                preco: 12.50,
                usuario_id: usuarioId
            },
            {
                id: 2,
                nome: "Brownie de Nutella",
                descricao: "Brownie com generosa camada de Nutella.",
                preco: 14.00,
                usuario_id: usuarioId
            },
            {
                id: 3,
                nome: "Brownie Tradicional",
                descricao: "Brownie clássico com pedaços de chocolate meio amargo.",
                preco: 10.00,
                usuario_id: usuarioId
            }
        ];

        // Flash messages para feedback
        const success = req.flash('success');
        const errors = req.flash('errors');

        res.render('meus-produtos', { 
            produtos: produtosFake,
            usuario: req.session.user,
            success: success.length > 0 ? success : null,
            errors: errors.length > 0 ? errors : null
        });

    } catch (error) {
        console.error("Erro ao listar produtos:", error);
        req.flash('errors', 'Erro ao carregar produtos');
        return res.redirect('/');
    }
};

// Listar produtos de um usuário específico (para perfil público)
exports.listarPorUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        // TODO: Buscar produtos do banco de dados quando estiver pronto
        const produtosFake = [
            {
                id: 1,
                nome: "Brownie de Doce de Leite",
                descricao: "Brownie recheado com doce de leite artesanal.",
                preco: 12.50,
                usuario_id: usuarioId
            },
            {
                id: 2,
                nome: "Brownie de Nutella",
                descricao: "Brownie com generosa camada de Nutella.",
                preco: 14.00,
                usuario_id: usuarioId
            }
        ];

        res.render('produtos-usuario', { 
            produtos: produtosFake,
            usuarioId: usuarioId
        });

    } catch (error) {
        console.error("Erro ao listar produtos do usuário:", error);
        res.status(500).send("Erro ao carregar produtos");
    }
};