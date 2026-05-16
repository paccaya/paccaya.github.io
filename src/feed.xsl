<?xml version="1.0" encoding="utf-8"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:atom="http://www.w3.org/2005/Atom">

<xsl:template match="/">
<html>
  <body style="font-family: sans-serif; max-width: 700px; margin: 40px auto;">
    <h1>
      <xsl:value-of select="atom:feed/atom:title"/>
    </h1>

    <p>
      <xsl:value-of select="atom:feed/atom:subtitle"/>
    </p>

    <xsl:for-each select="atom:feed/atom:entry">
      <article style="margin-bottom: 2rem;">
        <h2>
          <a href="{atom:link/@href}">
            <xsl:value-of select="atom:title"/>
          </a>
        </h2>

        <p>
          <xsl:value-of select="atom:summary"/>
        </p>
      </article>
    </xsl:for-each>
  </body>
</html>
</xsl:template>

</xsl:stylesheet>
