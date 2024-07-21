import Variants from '@/components/Variants';
import { faker } from '@faker-js/faker';

export const fake_categorias = Array.from({ length: 30 }, (v, k) => ({
    id: faker.number.int(),
    cat_id : faker.number.int(),
    cat_nome : faker.commerce.department(),
}))
export const fake_categoria = fake_categorias[0];

export const fake_tipos = Array.from({ length: 30 }, (v, k) => ({
    id: faker.number.int(),
    tp_id : faker.number.int(),
    tp_nome : faker.commerce.department(),
}))
export const fake_tipo = fake_tipos[0];

export const fake_produtos = Array.from({ length: 30 }, (v, k) => ({
    id: faker.number.int(),
    prodt_id: faker.number.int(),
    prodt_nome: faker.commerce.productName(),
    prodt_categoria : fake_categorias[Math.floor(Math.random() * 30)],
    prodt_tipo: fake_tipos[Math.floor(Math.random() * 30)],
    prodt_descricao: faker.commerce.productDescription(),
    prodt_fotos:  Array.from({ length: 7 }, (v, k) => (
        { 
            id: faker.number.int(),
            src : faker.image.urlLoremFlickr({ width: 600, height: 480, category: 'product' }) 
        }
    )),
    prodt_updated_at: faker.date.anytime(),
    prodt_status : ['ativo','liberacao','inativo'][Math.floor(Math.random() * 3)],
    prodt_opcoes : Array.from({ length: Math.floor(Math.random() * 5) }, (v, k) => ( { 
        opc_id: faker.number.int(),
        opc_nome: faker.commerce.productName(),
        opc_valores: [
            faker.commerce.productName(),
            faker.commerce.productName(),
            faker.commerce.productName(),
        ]
    })),
    prodt_tp_preco: {
        tp_prec_id: faker.number.int(),
        tp_preco_nome: faker.commerce.productName(),
    },
    prodt_variants : Array.from({ length: Math.floor(Math.random() * 5) }, (v, k) => ({
        vrnt_id: faker.number.int(),
        vrnt_foto : { src : faker.image.urlLoremFlickr({ width: 600, height: 480, category: 'product' }) },
        vrnt_preco : faker.commerce.price(),
        vrnt_opcoes: Array.from({ length: Math.floor(Math.random() * 5) }, (v, k) => ( { 
            opt_nome:faker.commerce.productName(), 
            opt_value : faker.commerce.productName(),  
        })),
    })),
}))

export const fake_produto = fake_produtos[0];

export const fake_estados = Array.from({ length: 30 }, (v, k) => ({
    id: faker.number.int(),
    est_id : faker.number.int(),
    est_nome : faker.location.state(),
}))
export const fake_estado = fake_estados[0];

export const fake_cidades = Array.from({ length: 30 }, (v, k) => ({
    id: faker.number.int(),
    cid_id : faker.number.int(),
    cid_nome : faker.location.city(),
}))
export const fake_cidade = fake_cidades[0];

export const fake_lojistas = Array.from({ length: 30 }, (v, k) => ({
    id: faker.number.int(),
    lojst_id : faker.number.int(),
    lojst_nome : faker.person.fullName(),
    lojst_cpf: faker.number.int(),
    lojst_img_perfil: faker.number.int(),
    lojst_telefone: faker.phone.number('67 9 ####-####'),
    lojst_email : faker.internet.email(),
    lojst_data_cadastro : faker.date.anytime(),
    lojst_cep: faker.location.zipCode(),
    lojst_estado : fake_estados[Math.floor(Math.random() * 5)],
    lojst_cidade : fake_cidades[Math.floor(Math.random() * 5)],
    lojst_bairro: faker.location.city(),
    lojst_endereco : faker.location.street(),
    lojst_login : faker.internet.userName(),
    lojst_status : ['ativo','pendente','inativo'][Math.floor(Math.random() * 3)],
}))
export const fake_lojista = fake_lojistas[0]

export const fake_lojas = Array.from({ length: 30 }, (v, k) => ({
    id: faker.number.int(),
    loj_id : faker.number.int(),
    loj_nome : faker.person.fullName(),
    loj_cnpj: faker.number.int(),
    loj_telefone: faker.phone.number('67 9 ####-####'),
    loj_email : faker.internet.email(),
    loj_data_cadastro : faker.date.anytime(),
    loj_cep: faker.location.zipCode(),
    loj_estado : fake_estados[Math.floor(Math.random() * 5)],
    loj_cidade : fake_cidades[Math.floor(Math.random() * 5)],
    loj_bairro: faker.location.city(),
    loj_endereco : faker.location.street(),
    loj_text_sobre: faker.company.catchPhrase(),
    loj_slogan : faker.company.catchPhrase(),
    loj_logo: { 
        id: faker.number.int(),
        src : faker.image.urlLoremFlickr({ width: 200, height: 160, category: 'logo' }) 
    }
}))
export const fake_loja = fake_lojas[0];


export const fake_tipos_precos = Array.from({ length: 30 }, (v, k) => ({
    id: faker.number.int(),
    tp_prec_id : faker.number.int(),
    tp_prec_nome : faker.commerce.department(),
}))
export const fake_tipo_preco = fake_tipos_precos[0];