class SeoController < ApplicationController
  skip_before_action :authenticate_user!, only: [:robots, :sitemap]
  
  def robots
    respond_to :text
    render plain: <<~ROBOTS
      User-agent: *
      Allow: /
      Disallow: /admin/
      Disallow: /teacher/
      Disallow: /student/
      Disallow: /users/
      
      Sitemap: https://shreesangeetaalaya.art/sitemap.xml
    ROBOTS
  end
  
  def sitemap
    respond_to :xml
    render xml: <<~XML
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>https://shreesangeetaalaya.art/</loc>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>
        <url>
          <loc>https://shreesangeetaalaya.art/gallery</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      </urlset>
    XML
  end
end
