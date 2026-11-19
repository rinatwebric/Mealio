import { useEffect } from 'react'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/shared/config'

type DocumentMeta = {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
}

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.content = content
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.append(element)
  }
  element.href = href
}

export function useDocumentMeta({ title, description, image, type = 'website' }: DocumentMeta) {
  useEffect(() => {
    const canonicalUrl = window.location.origin + window.location.pathname
    const ogImage = image ?? DEFAULT_OG_IMAGE

    document.title = title
    setMeta('name', 'description', description)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:image', ogImage)
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', ogImage)
    setCanonical(canonicalUrl)
  }, [title, description, image, type])
}