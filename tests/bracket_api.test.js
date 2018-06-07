const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const User = require('../models/user')

const { usersInDb } = require('./test_helper')

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

    expect(result.body).toEqual({ error: 'Username already taken'})

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

    expect(result.body).toEqual({ error: 'Password must be at least 3 characters'})

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

afterAll(() => {
  server.close()
})