import discord
import asyncio
import random
import os

cliente_discord = discord.Client()

@cliente_discord.event
async def on_ready():
    print('Online')

@cliente_discord.event
async def on_message(texto):
    if (texto.author.id == '466271784971272206'): return
    # Joga um dado num numero aleatorio de 1 a 6
    if texto.content.startswith('Bot'): #Se uma frase tiver Bot no inico
        frase = texto.content[3:].strip() #Tira 'Bot' da frase
        if frase.lower().startswith('dado'): #ATira dado de 1 a 6 
                        numr = random.randint(1,6)
                        await cliente_discord.send_message(texto.channel,str(numr))
                        return
    #

    # Adicionar chars
    chars = []
    if texto.content.startswith('AddChar'): #Se uma frase tiver Bot no inico
        frase = texto.content[7:].strip() #Tira 'AddChar' da frase
        chars.append(frase)
        total = len(chars)
        print("string + ", total)
        #cliente_discord.send_message(texto.channel,str(chars[0]))
        return
    #
    
    # Ver Lista de Chars
    
    if texto.content.startswith('ListChar'):
        print (chars[total])
        for x in range(len(chars)):
            await cliente_discord.send_message(texto.channel,(chars[x]))
            print(chars[x])
            return

cliente_discord.run('NDY2MjcxNzg0OTcxMjcyMjA2.DiZo-g.piDD0SNUd8PdOWXrntt0eExpBYg')
