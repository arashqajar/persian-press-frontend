import { defineType } from 'sanity'

export default defineType({
  name: 'staticPage',
  title: 'Static Pages',
  type: 'document',
  fields: [
    {
      name: 'slug',
      title: 'Slug (URL path)',
      type: 'string',
      description: "e.g. 'help' for /help",
      validation: Rule => Rule.required()
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          fields: [
            {
              name: 'language',
              title: 'Language',
              type: 'string',
              options: {
                list: [
                  { title: 'English', value: 'en' },
                  { title: 'Persian', value: 'fa' },
                ],
                layout: 'radio',
              },
            },
          ],
        },
      ],
    },
  ],
})
