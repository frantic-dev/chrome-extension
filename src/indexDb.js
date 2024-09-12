export const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('seriesDb', 1)

    request.onerror = event => {
      reject(`Error opening database: ${event.target.errorCode}`)
    }

    request.onsuccess = event => {
      const db = event.target.result
      resolve(db)
    }

    request.onupgradeneeded = event => {
      const db = event.target.result
      const objectStore = db.createObjectStore('seriesDb', {
        keyPath: 'id',
        autoIncrement: true,
      })
      objectStore.createIndex('url', 'url', { unique: false })
      objectStore.createIndex('title', 'title', { unique: false })
    }
  })
}

export const insertData = async serie => {
  const db = await openDB()
  const transaction = db.transaction(['seriesDb'], 'readwrite')
  const objectStore = transaction.objectStore('seriesDb')

  const request = objectStore.add(serie)

  request.onsuccess = () => {
    console.log('Data inserted successfully!')
  }

  request.onerror = event => {
    console.error(`Error inserting data: ${event.target.error}`)
  }
}

export const displayData = async displaySerie => {
  const db = await openDB()
  const transaction = db.transaction(['seriesDb'], 'readonly')
  const objectStore = transaction.objectStore('seriesDb')

  const request = objectStore.getAll()

  request.onsuccess = event => {
    const data = event.target.result
    for (let serie of data) {
      console.log(serie)
      displaySerie(serie)
    }
    console.log('List of Data:', data)
    // return data
    // Display or process the data as needed
  }

  request.onerror = event => {
    console.error(`Error listing data: ${event.target.error}`)
  }
}