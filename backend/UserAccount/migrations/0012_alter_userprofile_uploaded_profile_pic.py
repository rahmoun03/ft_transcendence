# Generated by Django 3.2.7 on 2025-02-02 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('UserAccount', '0011_alter_userprofile_uploaded_profile_pic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='uploaded_profile_pic',
            field=models.ImageField(blank=True, null=True, upload_to='../profile_pics/'),
        ),
    ]
