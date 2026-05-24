class Project {

  constructor(data = {}) {
    this.id = data.id || ''
    this.title = data.title || this.id
    this.file = data.file || `${this.id}.json`
    this.active = data.active !== false
  }

}
