require 'sinatra'
require 'json'

set :public_folder, 'public'

DATA_FILE = 'data/evenements.json'

helpers do
  def load_data
    return default_data unless File.exist?(DATA_FILE)

    JSON.parse(File.read(DATA_FILE))
  end

  def save_data(data)
    File.write(
      DATA_FILE,
      JSON.pretty_generate(data)
    )
  end

  def default_data
    {
      personnages: [],
      brins: [],
      evenements: []
    }
  end
end

get '/' do
  send_file File.join(
    settings.public_folder,
    'index.html'
  )
end

get '/events' do
  content_type :json

  load_data.to_json
end

post '/events' do
  request.body.rewind

  raw =
    request.body.read

  data =
    JSON.parse(raw)

  save_data(data)

  content_type :json

  {
    status: 'ok'
  }.to_json
end