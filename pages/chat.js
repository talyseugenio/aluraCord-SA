import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'
import {useRouter} from "next/router"

//AJAX: https://medium.com/@omariosouto/entendendo-como-fazer-ajax-com-a-fetchapi-977ff20da3c6#:~:text=Para%20conseguir%20pegar%20o%20dado,estamos%20fazendo%20para%20o%20servidor.

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyNzM5NSwiZXhwIjoxOTU4OTAzMzk1fQ.pzReI9hYvAphaUMLGBHlLsSBqZJwHqKWv2TWcrif42w"
const SUPABASE_URL = "https://inyrjmcswlxxkhnqepew.supabase.co"
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    //backend será esse vetor (variável)
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const router = useRouter();
    const { username } = router.query;
    console.log(username)


    React.useEffect(() => {
        const dadoSupabase = supabaseClient
            .from("mensagens")
            .select("*")
            .order("id", { ascending: false })
            .then(({ data, error }) => {
                console.log("Dados da consulta", data)
                setListaDeMensagens(data)
            })
    }, [])

    /*
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
    - [X] Lista de mensagens 
    */
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            de: username,
            texto: novaMensagem,
        };
        supabaseClient
            .from("mensagens")
            .insert([
                //objeto com os mesmos campos do supabase
                mensagem
            ])
            .then(({ data }) => {
                // console.log("Criando Mensagem: ", resposta)
                setListaDeMensagens([
                    data[0],
                    ...listaDeMensagens,
                ]);
            })


        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: "#DCDCDC",
                backgroundImage: 'url(https://files.tecnoblog.net/wp-content/uploads/2019/07/gta-san-andreas-001-1-700x475.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} />
                    {/* {listaDeMensagens.map((mensagemAtual => {
                        // console.log(mensagemAtual)
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })
                    )} */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',

                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                // console.log(event)
                                const valor = event.target.value;
                                setMensagem(valor);
                                // console.log(mensagem)
                            }
                            }
                            //visualizar qual tecla foi utilizada
                            onKeyPress={(event) => {
                                //visualizar tecla
                                if (event.key === "Enter") {
                                    //não pular de linha ao apertar enter
                                    event.preventDefault()
                                    // console.log(event)
                                    handleNovaMensagem(mensagem)
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            onClick={() => handleNovaMensagem(mensagem)}
                            label='Enviar'
                            fullWidth
                            styleSheet={{
                                maxWidth: '100px',
                            }
                            }
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: "#696969",
                                mainColorStrong: "#363636",
                            }}

                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            placeholder = "Carregando..."
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
                
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                            src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto}
                    </Text>
                );
            })}
        </Box>
    )
}