import json
import os

from flask import Flask, render_template, request

import flickrapi


app = Flask(__name__, static_url_path='/static')
app.debug = True

API_KEY = os.environ.get('API_KEY')
API_SECRET = os.environ.get('API_SECRET')


@app.route('/')
def main():
    return render_template('main.html')


@app.route('/search')
def get_photos():
    tag = request.args['tag']

    flickr = flickrapi.FlickrAPI(API_KEY, API_SECRET, format='parsed-json')
    flickr.authenticate_via_browser(perms='read')

    coordinates = []

    def search_photos(page=1):
        response = flickr.photos.search(
            tags=[tag], extras=['geo'],
            per_page=500, page=page)['photos']['photo']
        for r in response:
            if r['longitude'] and r['latitude']:
                coordinates.append({
                    'lat': float(r['latitude']),
                    'lng': float(r['longitude'])})
        if response and len(coordinates) < 500:
            search_photos(page=page + 1)

    search_photos()

    return json.dumps(coordinates)

if __name__ == '__main__':
    app.run()