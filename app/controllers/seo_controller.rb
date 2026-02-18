class SeoController < ApplicationController
  skip_before_action :authenticate_user!, only: [:robots, :sitemap]

  def robots
    respond_to do |format|
      format.text { render plain: robots_content }
      format.any  { render plain: robots_content, content_type: 'text/plain' }
    end
  end

  def sitemap
    respond_to do |format|
      format.xml  { render xml: sitemap_content }
      format.any  { render plain: sitemap_content, content_type: 'application/xml' }
    end
  end

  private

  def robots_content
    <<~ROBOTS
      User-agent: *
      Allow: /
      Allow: /gallery
      Disallow: /admin/
      Disallow: /teacher/
      Disallow: /student/
      Disallow: /users/sign_in
      Disallow: /users/sign_out
      Disallow: /users/password/
      Disallow: /rails/
      Disallow: /up

      User-agent: Googlebot
      Allow: /
      Disallow: /admin/
      Disallow: /teacher/
      Disallow: /student/
      Disallow: /users/

      Crawl-delay: 10

      Sitemap: https://shreesangeetaalaya.art/sitemap.xml
    ROBOTS
  end

  def sitemap_content
    last_mod = Date.today.iso8601
    <<~XML
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
              xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
              xmlns:xhtml="http://www.w3.org/1999/xhtml">

        <url>
          <loc>https://shreesangeetaalaya.art/</loc>
          <lastmod>#{last_mod}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>1.0</priority>
        </url>

        <url>
          <loc>https://shreesangeetaalaya.art/gallery</loc>
          <lastmod>#{last_mod}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>

      </urlset>
    XML
  end
end
