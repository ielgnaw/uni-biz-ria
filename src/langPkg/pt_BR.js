/**
 * @file uni-biz-ria 里的中文语言包
 * @author ielgnaw(wuji0223@gmail.com)
 */

define(function (require) {

    var zhCN = {
        // 操作失败
        'CZSB': 'A operação falhou',
        // 尚未登录，请登录
        'SWDL': 'Por favor, registre-se ou faça login primeiro',
        // 正在读取数据，请稍候
        'ZZDQ': 'Carregando...',
        // 管理标识
        'GLBS': 'identidade de administração',
        // 管理标识：
        'GLBS1': 'Identificador administrativo: ',
        // 最多30个字符
        'ZD30GZF': 'Pode ter no máximo 30 caráteres',
        // 必填
        'BT': 'Obrigatório preencher',
        // 保存
        'BC': 'Guardar',
        // 取消
        'QX': 'cancelar',
        // 点击上传
        'DJSC': 'Clicar para fazer upload',
        // 重新上传
        'CXSC': 'Fazer upload de novo',
        // 正在上传
        'ZZSC': 'Fazendo upload',
        // 上传完成
        'SCWC': 'Upload concluído',
        // 未选择文件
        'WXZWJ': 'Nenhum arquivo foi escolhido',
        // 仅接受以下文件格式：
        'JJSYXWJGS1': 'Suportamos os seguintes tipos de arquivos: ',
        // 上传失败
        'SCSB': 'Upload falhou',
        // 该标识只做系统管理使用，与展现无关
        'YZXWG': 'O sistema de gestão de ID, não TEM Nada a ver com mostrar',
        // 确认添加创意？
        'QRTJCY': 'Tem certeza adicionar a ídeia?',
        // 确认修改创意？
        'RQXGCY': 'Tem certeza alterar a ídeia?',
        // 确认
        'QR': 'OK',
        // 返回
        'FH': 'Voltar',
        // 已经审核通过的创意不能修改
        'YJSHBNXG': 'Não pode alterar ideias aprovadas ',
        // ${title}不能超过${exMaxLength}个字符，每个中文及中文符号计为两个字符
        'BNCGGZF': ''
            + '${title} não Pode exceder ${exMaxLength} caracteres EM chinês e inglês, '
            + 'para cadA símbolo de dois caracteres',
        // ${title}不能为空
        'BTBNWK': 'Obrigatório preencher',
        // 请选择多选框
        'QXZDXK': 'Escolher a caixa de seleção',
        // 选择的个数超过最大个数
        'GSCG': 'Você escolheu mais que o limite máximo',
        // 请选择
        'QXZ': 'Escolher ',
        // 请填写
        'QTX': 'Preencha ',
        // 机构地址
        'JGDZ': 'Endreço da entidade',
        // 最多选择
        'ZDXZ': ' Escolha a maior ',
        // 个
        'Ge': ' ',
        // 机构简称与机构URL将使用您在“婚纱摄影机构信息”中填写的信息
        'JGJCXX': ''
            + 'nstituições e agências de URL que você está '
            + 'usando "fotografia de Casamento detalhes EM agências de informações"',

        // form 动态配置中的语言包，这里使用中文为 key
        // 是因为这样可以在拿到 form 配置时最快速的替换对应的语言
        // 中文可以不用配置，默认是中文
        /**
         * 5201
         */
        '图片链接URL': 'Link URL',
        '请填写图片链接URL': 'Por favor, preencha o URL do link para a Imagem',
        '这是个tip': 'Esta é UMA DICA',
        '网址格式错误': 'Erro de formato',
        '创意图片': 'Fotografia criativa',
        '选择创意图片': 'Seleção de Imagens criativas',
        '图片上传也能出 tip': 'Também Pode ser UMA DICA de upload de fotos',
        '请选择创意图片': 'Por favor, escolha a criatividade',
        '图册风格': 'O estilo',

        /**
         * 1101
         */
        '哈哈': 'HaHa',
        '选择yato': 'Seleção yato',
        'yato 的 tip': 'yato\'s tip',
        '请选择yato': 'Seleção yato',
        // 5201 中已经写过，这里标识下
        // '创意图片': 'Fotografia criativa',
        // '选择创意图片': 'Seleção de Imagens criativas',
        // '图片上传也能出 tip': 'Também Pode ser UMA DICA de upload de fotos',
        // '请选择创意图片': 'Por favor, escolha a criatividade',
        '平台': 'plataforma',
        '图册1风格': '1 estilo',
        '浪漫': 'Romântico',
        '大气': 'Smart',
        '其他': 'Outros',

        /**
         * 5102
         */
        '描述': 'Descrição',
        '最少32个字符，最多160个字符': 'Pelo Menos 32 caracteres, no máximo 16 caracteres',
        '创意url': 'Creative URL',
        // 5201 中已经写过，这里标识下
        // '网址格式错误': 'Erro de formato'


        /**
         * 5103
         */
        '图册主题': 'O Tema',
        '最多12个字符': 'No máximo 12 caracteres',
        '图册封面图片': 'A Imagem Da CAPA do álbum',
        '图片尺寸320*240': 'O tamanho Da Imagem de 320*240',
        '请选择图册封面图片': 'Por favor, escolha a Imagem Da CAPA do álbum',
        '图册url': 'URL',
        '请填写图册url': 'Por favor, preencha o URL',
        // 5201 中写过
        // '网址格式错误': '',
        '图册图片数量': 'O número de álbuns de fotos',
        '请填写正整数': 'Por favor, preencha por inteiro',
        '数字最大为20': 'Número máximo de 20',
        '张': 's',
        '图册数量不能超过20张': 'O número não Pode ser superior a 20.',
        '最多选三个风格': 'Escolher no máximo três ESTILOS',
        // 5201 中写过
        // '图册风格': '',
        // 1101 中写过
        // '浪漫': '',
        '韩式': 'Coreano',
        '小清新': 'Pequeno fresco',
        '复古': 'Retro',
        '欧洲': 'A Europa',
        '中式': 'Estilo chinês',
        '海景': 'Com Vista para o Mar',
        '水下': 'Debaixo de água',
        '花海': 'Flores',
        '时尚': 'Moda',
        '图册场景': 'A cena.',
        '内景': 'Int',
        '独家基地': 'Base exclusiva',
        '本地': 'Local',
        '外省': 'Fora',
        '境外': 'Estrangeiros',
        '图册类型': 'Tipo de Atlas',
        '客片': 'OS comprimidos',
        '样片': 'A amostra',
        '图片Url': 'Fotos de URL',


        /**
         * 5104
         */
        '套系1图片(封面)': 'Conjunto de 1 foto (CAPA)',
        '图片尺寸420*315': 'O tamanho Da Imagem de 420*315',
        '请选择套系1图片': 'Por favor, escolha o conjunto 1',
        '套系2图片': 'Conjunto de 2 fotos',
        '请选择套系2图片': 'Por favor, escolha o conjunto 2',
        '套系3图片': 'Conjunto de 3 fotos',
        '请选择套系3图片': 'Por favor, escolha o conjunto de 3 fotos',
        '套系url': 'Conjunto de URL',
        '套系特色': 'Conjunto de características',
        '最多32个字符': 'Até 32 caracteres',
        '服装套数': 'Conjuntos de roupas',
        '请选择服装套数': 'Por favor, escolha o número de roupas',
        '不限': 'SEM limite de',
        '咨询客服': 'EM Contato com o serviço Ao cliente',
        '造型套数': 'Número de modelo',
        '请选择造型套数': 'Por favor, escolha o número de modelo',
        '拍摄张数': 'O número de TIROS',
        '数字最大为1000': 'Número máximo de 1000',
        '拍摄张数不能超过1000张': 'Não Mais de 1000 fotos',
        '精修张数': 'Número de folhas de acabamento',
        '精修张数不能超过1000张': 'O número não Pode ser superior a 1000 acabamento',
        '底片全部赠送': 'De todos OS presentes',
        '底片是否赠送': 'Se DEU negativo',
        '是': 'é',
        '拍摄场景1': 'Cena 1',
        '最多24个字符': '24 caracteres, no máximo',
        '拍摄场景2': 'Cena 2',
        '拍摄场景3': 'Cena 3',
        '到店即赠1赠品': '1 Loja para presentes',
        '赠品1价格': 'Brindes 1 preço',
        '数字最大为9999': 'O maior número de 9999',
        '请填写数字': 'Por favor preencha OS números',
        '赠品价格最高9999元': 'Preços de presentes Mais de 9999 reais',
        '到店即赠2赠品': 'Loja com 2 brindes:',
        '赠品2价格': 'Preço brindes 2',
        '原价': 'O preço original',
        '元': 'reais',
        '现价': 'Preço',

        /**
         * 6101
         */
        '产品名称': 'Nome do Produto',
        '开发商名称': 'O Nome de desenvolvedores',
        '请填写开发商名称': 'Por favor, preencha o Nome do desenvolvedor',
        '产品简介': 'Descrição do Produto',
        '请填写产品简介': 'Por favor, preencha a descrição do Produto',
        '下载链接': 'Download link',
        '请填写下载链接': 'Por favor, preencha o link de Download',
        '详情链接': 'Detalhes link',
        '请填写详情链接': 'Por favor, preencha detalhes',
        '安卓必填': 'Android Obrigatório preencher',
        '应用版本信息': 'A aplicação de edição de informações',
        '请填写应用版本信息': 'Por favor, preencha o pedido de informação de versão',
        '应用大小（MB）': 'Aplicação de tamanho (MB)',
        '请填写应用大小': 'Por favor, preencha com o tamanho',
        '产品LOGO': 'Produtos do logotipo',
        '图片尺寸75*75': 'O tamanho Da Imagem de 75*75',
        '请选择产品LOGO': 'Por favor, escolha o Produto',

        /**
         * 6102
         */
        '图片大小640*240': 'O tamanho Da Imagem de 640*240',

        /**
         * 550001
         */
        '标题': 'Título',
        '显示url': 'Mostrar o url',
        '跳转url': 'Salto de url',
        '摘要': 'Resumo'

    };

    return zhCN;
});
