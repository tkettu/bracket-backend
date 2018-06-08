const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const User = require('../models/user')

const { usersInDb, newBracket, bracketsInDb } = require('./test_helper')

describe('Adding users', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('POST accectable user', async () => {
    const usersBefore = await usersInDb()

    const newUser = {
      username: 'SoccerFan69',
      name: 'TORNAATTORI',
      password: 'anasalas'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length + 1)
    const usernames = usersAfter.map(un => un.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST user without unique value', async () => {
    const usersBefore = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Toor koor',
      password: 'V3r1MuC45EkR3t'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'Username already taken' })

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
    const usernames = usersAfter.map(un => un.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST user with sort password', async () => {
    const usersBefore = await usersInDb()

    const newUser = {
      username: 'Stupid',
      name: 'Red Neck',
      password: 'Re'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body).toEqual({ error: 'Password must be at least 3 characters' })

    const usersAfter = await usersInDb()
    expect(usersAfter.length).toBe(usersBefore.length)
    const usernames = usersAfter.map(un => un.username)
    expect(usernames).not.toContain(newUser.username)
  })
})

describe('User logging ', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = { username: 'Roki', name: 'Toki', password: 'salsana' }
    await api
      .post('/api/users')
      .send(user)
  })

  test('POST correct login credentials', async () => {

    const usersBefore = await usersInDb()
    console.log(usersBefore.length)

    const userLogging = {
      username: 'Roki',
      password: 'salsana'
    }

    const result = await api
      .post('/api/login')
      .send(userLogging)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.username).toBe(userLogging.username)

  })
})

describe.only('Brackets', async () => {
  beforeAll(async () => {
    await User.remove({})
    const user = { username: 'Roki', name: 'Toki', password: 'salsana' }
    await api
      .post('/api/users')
      .send(user)

    /* await api
      .post('/api/login')
      .send({ username: 'Roki', password: 'salsana' }) */
  })

  test('POST  bracket without login ', async () => {

    const bracketsBefore = await bracketsInDb()

    await api
      .post('/api/brackets')
      .send(newBracket)
      .expect(401)

    const bracketsAfter = await bracketsInDb()
    expect(bracketsAfter.length).toBe(bracketsBefore.length)
  })

  test('POST  empty bracket ', async () => {

    const loggedUser = await api
      .post('/api/login')
      .send({ username: 'Roki', password: 'salsana' })

    console.log(loggedUser.body)

    console.log(`bearer ${loggedUser.body.token}`)
    //console.log(`USER ${loggedUser.body}`)
    const bracketsBefore = await bracketsInDb()
    //.auth(loggedUser.body.user.username)
    await api
      .post('/api/brackets')
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .send('')
      .expect(400)

    const bracketsAfter = await bracketsInDb()
    expect(bracketsAfter.length).toBe(bracketsBefore.length)
  })

  test('POST acceptable bracket ', async () => {

    const loggedUser = await api
      .post('/api/login')
      .send({ username: 'Roki', password: 'salsana' })

    const bracketsBefore = await bracketsInDb()
    console.log(bracketsBefore)
    console.log(loggedUser.body)
    console.log(newBracket)

    await api
      .post('/api/brackets')
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .send({ bracket: newBracket })
      .expect(200)

    const bracketsAfter = await bracketsInDb()
    const userAfter = await User.find({ username: loggedUser.body.username })
    console.log(bracketsAfter)
    console.log(userAfter)

    expect(bracketsAfter.length).toBe(bracketsBefore.length + 1)
    //expect(userAfter.body.bracket._id).toEqual(newBracket)
  })

  test('GET bracket without user ', async () => {

    await api
      .get('/api/brackets')
      .expect(401)
  })

  test('GET bracket user bracket ', async () => {

    const loggedUser = await api
      .post('/api/login')
      .send({ username: 'Roki', password: 'salsana' })

    const result = await api
      .get('/api/brackets')
      .set('Authorization', `bearer ${loggedUser.body.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    console.log(result.body)

  })

})

afterAll(() => {
  server.close()
})